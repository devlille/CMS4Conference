import { WorkflowStatus } from "../../model";
import { StatusEnum } from "../../utils/document-change";

export const makeTicketStepAsDone = (
  status: WorkflowStatus
): { status: WorkflowStatus } => {
  return {
    status: {
      ...status,
      code: StatusEnum.DONE,
    },
  };
};
