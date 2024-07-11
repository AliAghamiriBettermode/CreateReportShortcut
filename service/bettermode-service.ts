import got from 'got'
import _ from 'lodash'
import { BETTERMODE_SHORTCUTS } from '../consts/shortcuts.js'
import { ModerationEntityType } from '../consts/moderation-entity-type.js'
import { ReportCategory } from '../consts/report-category.js'
import CallbackController from '../controller/callback-controller.js'
import { encodeBase64 } from '../utils/utils.js'

class BettermodeService {
  static instance: BettermodeService
  static clientId = process.env.CLIENT_ID || '' // TODO: Fill this with actual data or use environment variables
  static clientSecret = process.env.CLIENT_SECRET || '' // TODO: Fill this with actual data or use environment variables

  handleShortcutStates(data: any) {
    try {
      const entities = _.chain(data.entities)
        .map(e => (_.map(e.shortcuts, s => ({ ...e, shortcut: s, shortcuts: undefined }))))
        .flatten()
        .value()
      const shortcutStates: ({
        shortcutState: { shortcut: any; state: string };
        context: any;
        entityId: any
      })[] = _.chain(entities).map((entity) => {
        const shortcut = _.find(BETTERMODE_SHORTCUTS, { key: entity.shortcut })
        if (!shortcut) return null
        return {
          context: entity.context,
          entityId: entity.entity.id,
          shortcutState: {
            shortcut: entity.shortcut,
            state: shortcut.states[0], // TODO: handle state based on logic
          },
        }
      }).compact().value()
      return {
        type: 'SHORTCUTS_STATES',
        status: 'SUCCEEDED',
        data: _.map(data.entities, e => {
          return {
            context: e.context,
            entityId: e.entity.id,
            shortcutStates: _.chain(shortcutStates)
              .filter(ss => ss && ss.context === e.context && ss.entityId === e.entity.id)
              .map(ss => ss.shortcutState)
              .value(),
          }
        }),
      }
    } catch (e) {
      console.error(e)
      return {}
    }
  }

  async getMemberAccessToken(networkId: string, memberId: string) {
    try {
      const response = await got.post('https://api.bettermode.com', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encodeBase64(`${BettermodeService.clientId}:${BettermodeService.clientSecret}`)}`,
        },
        json: {
          query: `query{
              limitedToken(context: NETWORK, entityId: "${networkId}", networkId: "${networkId}", impersonateMemberId:"${memberId}"){
                  accessToken
              }
            }`,
          variables: {},
        },
      })
      return JSON.parse(response.body).data.limitedToken.accessToken
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async handleInteraction(data: any) {
    if (!_.chain(BETTERMODE_SHORTCUTS).map('key').includes(data.data.shortcutKey).value()) {
      return {}
    }
    const shortcut = _.find(BETTERMODE_SHORTCUTS, { key: data.data.shortcutKey })
    if (data.data.callbackId) {
      const response = await CallbackController.getInstance().handleCallback(data.data.callbackId, data)
      return {
        type: 'INTERACTION',
        status: 'SUCCEEDED',
        data: {
          appId: data.data.appId,
          interactionId: data.data.interactionId,
          interactions: response ?? [],
        },
      }
    }
    return {
      type: 'INTERACTION',
      status: 'SUCCEEDED',
      data: {
        appId: data.data.appId,
        interactionId: data.data.interactionId,
        interactions: shortcut?.interactions ?? [],
      },
    }
  }

  async createModerationReport(networkId: string, memberId: string, entityType: ModerationEntityType, entityId: string, reportCategory: ReportCategory, description: string) {
    const accessToken = await this.getMemberAccessToken(networkId, memberId)
    if (!accessToken) {
      return false
    }
    try {
      const response = await got.post('https://api.bettermode.com', {
        json: {
          query: `mutation CreateModerationReport {
                    createModerationReport(
                        input: {
                            description: "${description}"
                            entityId: "${entityId}"
                            reportCategory: ${reportCategory}
                            entityType: ${entityType}
                        }
                    ) {
                        id
                        status
                    }
                }`,
          variables: {},
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return JSON.parse(response.body)
    } catch (e) {
      console.error(e)
      return {}
    }
  }

  static getInstance() {
    if (!BettermodeService.instance) {
      BettermodeService.instance = new BettermodeService()
    }
    return BettermodeService.instance
  }
}

export default BettermodeService