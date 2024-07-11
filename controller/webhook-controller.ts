import { verifySignature } from '../utils/utils.js'
import BettermodeService from '../service/bettermode-service.js'
import _ from 'lodash'

class WebhookController {
  static instance: WebhookController

  webhookSignatureMiddleware(req: any, res: any, next: any) {
    const rawBody = req['rawBody']
    const timestamp = parseInt(req.header('X-Bettermode-Request-Timestamp'), 10)
    const signature = req.header('X-Bettermode-Signature')
    try {
      if (rawBody && verifySignature({
        body: rawBody,
        timestamp,
        signature,
        secret: process.env.WEBHOOK_SIGNING_SECRET ?? '', // TODO: Fill this with actual data or use environment variables
      })) {
        return next()
      }
    } catch (err) {
      console.error(err)
    }
    return res.status(403).json({ error: 'The X-Bettermode-Signature is not valid.' })
  }

  async handleWebhook(body: any) {
    switch (body.type) {
      case 'TEST':
        return {
          'type': 'TEST',
          'status': 'SUCCEEDED',
          'data': {
            'challenge': body.data.challenge,
          },
        }
      case 'SHORTCUTS_STATES':
        return BettermodeService.getInstance().handleShortcutStates(body.data)
      case 'INTERACTION':
        return BettermodeService.getInstance().handleInteraction(body)
      default:
        return {}
    }
  }

  static getInstance() {
    if (!WebhookController.instance) {
      WebhookController.instance = new WebhookController()
    }
    return WebhookController.instance
  }
}

export default WebhookController