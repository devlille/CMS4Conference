import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Workflow {
  id: number;
  steps: WorkflowStep[];
}

export type State = 'disabled' | 'enabled' | 'pending' | 'done' | 'refused' | 'retry';

export interface WorkflowStep {
  key: keyof WorkflowStatus;
  order: number;
  title: string;
  state: State;
  icon: string;
  description: string;
  class: 'is-primary' | 'is-danger' | 'is-secondary' | '';
}

export interface WorkflowStatus {
  filled?: State;
  validated?: State;
  sign?: State;
  paid?: State;
  received?: State;
  communicated?: State;
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private readonly firestore = inject(Firestore);
  private readonly workflowCollectionRef = collection(this.firestore, 'workflows');

  public add(workflow: Workflow) {
    return addDoc(this.workflowCollectionRef, workflow);
  }

  public update(id: string, fields: Partial<Workflow>) {
    return updateDoc(doc(this.firestore, `workflow/${id}`), fields);
  }

  public getAll(): Observable<Workflow[]> {
    return collectionData(this.workflowCollectionRef) as Observable<Workflow[]>;
  }
}
