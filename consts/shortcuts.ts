import { ReportCategory } from './report-category.js'
import { InteractionType } from './interaction-type.js'

export const BETTERMODE_SHORTCUTS: {
  key: string,
  context: string,
  states: string[],
  interactions: any,
}[] = [
  {
    key: 'custom-post-report',
    context: 'POST',
    states: [
      'Report post',
    ],
    interactions: [
      {
        id: 'post-report-modal',
        type: InteractionType.OPEN_MODAL,
        props: {
          title: 'Report post',
          size: 'md',
        },
        slate: {
          rootBlock: 'root',
          blocks: [
            {
              id: 'root',
              name: 'Form',
              props: JSON.stringify({
                callbackId: 'report-post-callback',
              }),
              children: JSON.stringify([
                'type-select-container',
                'description-input-container',
                'submit-button-container',
              ]),
            },
            {
              id: 'type-select-container',
              name: 'Container',
              props: JSON.stringify({
                padding: 'sm',
              }),
              children: JSON.stringify(['type-select']),
            },
            {
              id: 'type-select',
              name: 'Select',
              props: JSON.stringify({
                name: 'type',
                label: 'Report type',
                value: ReportCategory.SPAM,
                defaultValue: ReportCategory.SPAM,
                required: true,
                items: [
                  { value: ReportCategory.HARASSMENT, text: 'Harassment or hate speech' },
                  { value: ReportCategory.SPAM, text: 'Spam' },
                  { value: ReportCategory.MISINFORMATION, text: 'Misinformation' },
                  { value: ReportCategory.VIOLENCE, text: 'Harmful activities' },
                  { value: ReportCategory.NUDITY, text: 'Adult content' },
                ],
              }),
            },
            {
              id: 'description-input-container',
              name: 'Container',
              props: JSON.stringify({
                padding: 'sm',
              }),
              children: JSON.stringify(['description-input']),
            },
            {
              id: 'description-input',
              name: 'Textarea',
              props: JSON.stringify({
                name: 'description',
                label: 'Description',
                placeholder: 'Enter the description',
                required: true,
              }),
            },
            {
              id: 'submit-button-container',
              name: 'Container',
              props: JSON.stringify({
                padding: 'sm',
              }),
              children: JSON.stringify(['submit-button']),
            },
            {
              id: 'submit-button',
              name: 'Button',
              props: JSON.stringify({
                variant: 'primary',
                text: 'Submit',
                type: 'submit',
              }),
            },
          ],
        },
      },
    ]
  },
]