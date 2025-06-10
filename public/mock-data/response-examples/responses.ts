const responses: string[] = [
  `Thank you for the opportunity to review the current offer.
We appreciate the provided details and the option to participate under the terms outlined.
Please find attached the completed selection sheet in accordance with the requested format and submission guidelines. We confirm our understanding of the conditions applicable to the material offered, including but not limited to availability, processing timelines, documentation, and pricing contingencies.
We look forward to receiving confirmation of award and will proceed with the necessary documentation and logistics upon notification.
Should you require any further clarification regarding the submitted selections, please feel free to reach out.`,

  `We acknowledge receipt of your offer and appreciate the opportunity to review and participate. Attached you will find our completed selection form as per the provided instructions. We confirm our intent to proceed in alignment with the general terms and procedural requirements stated in the offer documentation. Please advise us on the next steps following your review. We remain available should any clarifications be necessary.`,

  `Thank you for extending this opportunity. We have reviewed the offer and completed the necessary fields in the selection spreadsheet, which is enclosed with this message. We acknowledge and accept the general provisions and look forward to your confirmation on the award status. Please don’t hesitate to contact us if further information is needed.`,

  `Attached is our response to the current offer in the required format. We have completed the requested fields and confirm our understanding of the relevant commercial and logistical conditions. We kindly await confirmation of acceptance and further instructions. Thank you for your attention and continued cooperation.`,

  `We appreciate the provided offer and have submitted our selections accordingly. Please find the completed spreadsheet attached for your consideration. We understand the offer terms and await confirmation of any awarded items to proceed with formal documentation. Should anything further be required, please let us know.`
];

export function getRandomResponse(): string {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}
