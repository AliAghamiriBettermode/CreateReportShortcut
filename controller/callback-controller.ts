import { InteractionType } from '../consts/interaction-type.js'
import { ToastStatus } from '../consts/toast-status.js'
import BettermodeService from '../service/bettermode-service.js'
import { ModerationEntityType } from '../consts/moderation-entity-type.js'

class CallbackController {
  static instance: CallbackController

  async handleCallback(callbackId: string, data: any) {
    switch (callbackId) {
      case 'report-post-callback':
        return this.handleReportPostCallback(data)
      default:
        return []
    }
  }

  async handleReportPostCallback(data: any) {
    const { actorId } = data.data
    const { type, description } = data.data.inputs
    const { entityId, networkId } = data
    console.log(data)
    if (!type || !description) {
      return [
        {
          id: 'post-report-submit-error',
          type: InteractionType.OPEN_TOAST,
          props: {
            title: 'Error',
            status: ToastStatus.ERROR,
            description: `Please fill in required fields`,
          },
        },
      ]
    }
    try {
      const response = await BettermodeService.getInstance().createModerationReport(networkId, actorId, ModerationEntityType.POST, entityId, type, description)
      if (response?.data?.createModerationReport?.id) {
        return [
          {
            id: 'post-report-modal',
            type: InteractionType.CLOSE,
          },
          {
            id: 'post-report-submit-success',
            type: InteractionType.OPEN_TOAST,
            props: {
              title: 'Done!',
              status: ToastStatus.SUCCESS,
              description: `Post report succeeded`,
            },
          },
        ]
      } else {
        return [
          {
            id: 'post-report-submit-error',
            type: InteractionType.OPEN_TOAST,
            props: {
              title: 'Error',
              status: ToastStatus.ERROR,
              description: `Post report failed`,
            },
          },
        ]
      }
    } catch (e) {
      console.error(e)
      return [
        {
          id: 'post-report-submit-error',
          type: InteractionType.OPEN_TOAST,
          props: {
            title: 'Error',
            status: ToastStatus.ERROR,
            description: `Post report failed`,
          },
        },
      ]
    }
  }

  static getInstance() {
    if (!CallbackController.instance) {
      CallbackController.instance = new CallbackController()
    }
    return CallbackController.instance
  }
}

export default CallbackController