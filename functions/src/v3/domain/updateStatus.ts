import { WorkflowStatus } from '../../model';
import { StatusEnum } from '../../utils/document-change';

const makeStepAsDone = (step: keyof WorkflowStatus, previousStatus: WorkflowStatus) => {
  return {
    status: {
      ...previousStatus,
      [step]: StatusEnum.DONE
    }
  };
};
export const makeTicketStepAsDone = (status: WorkflowStatus): { status: WorkflowStatus } => makeStepAsDone('code', status);
