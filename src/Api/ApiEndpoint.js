export const url = 'https://demo.ezclicktech.com/Ezclick/'; //demo
// export const url = 'https://bp.mypolicynow.com/'; //live

export const Api_Endpoints = {
  login_Endpoint: `${url}api/api/login_pos`,
  proposal_counter_endpoint: `${url}api/api/proposal_counter`,
  submit_inspection_checkpoint: `${url}api/submit_inspection_report`,
  submit_inspection_images_new: `${url}api/submit_inspection_images`,
  submit_inspection_Video_Endpoint: `${url}api/updateBreakInVideo`,
  update_Proposal_Steps: `${url}api/update_proposal_steps`,


  fetch_Image_inspection_question_Endpoint: `${url}api/fetch_image_inspection_question`,
  submit_odometer_reading_Endpoint: `${url}api/odomete_insert_data`,

  fetch_Checkpoint_inspection_question_Endpoint: `${url}api/fetch_breaking_question`,

  fetchPendingInspectionEndpoint: `${url}api/api/fetch_breaking_pending_data`,
  fetchProgressInspectionEndpoint: `${url}api/api/fetch_breaking_progress_data`,
  fetchRejectedInspectionEndpoint: `${url}api/api/fetch_breaking_rejected_data`,

  fetchRefferBackInspectionEndpoint: `${url}api/api/fetch_breaking_referback_data`,
  getFullreportEndpoint: `${url}api/getBreakinDetails`,


  fetchProposalDetailsEndpoint: `${url}api/get_proposal_details`,
  fetchLoginDetailsByProposalNoEndpoint: `${url}api/get_proposal_user_details`,
};
