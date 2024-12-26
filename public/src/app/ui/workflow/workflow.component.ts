import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Company, Workflow, WorkflowStep } from '../../model/company';
import { StoreService } from '../../services/store.service';
import { WorkflowService } from '../../services/workflow.service';
import { LoaderComponent } from '../loader/loader.component';
import { PanelItemComponent } from '../panel-item/panel-item.component';

@Component({
  selector: 'cms-workflow',
  imports: [CommonModule, LoaderComponent, MatExpansionModule, PanelItemComponent],
  templateUrl: './workflow.component.html'
})
export class WorkflowComponent {
  public id: string | undefined | null;
  public workflow: Workflow | undefined;
  public partner: Company | undefined;
  public isLoading = true;
  public isAdmin = false;

  private readonly route = inject(ActivatedRoute);
  private readonly partnerStore = inject(StoreService);
  private readonly workflowService = inject(WorkflowService);
  private readonly auth = inject(Auth);

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.auth.onAuthStateChanged((state) => {
      this.isAdmin = state?.email?.endsWith('@' + environment.emailDomain) ?? false;
    });

    this.workflowService
      .getAll()
      .pipe(
        tap((workflow) => (this.workflow = workflow[0])),
        switchMap(() => {
          return this.partnerStore.partner$;
        })
      )
      .subscribe((partner) => {
        this.partner = partner as Company;
        this.applyWorkflow(this.workflow as Workflow);
      });
  }

  applyWorkflow(workflow: Workflow) {
    if (!workflow) {
      return;
    }
    workflow.steps = workflow.steps
      .sort((s1, s2) => s1.order - s2.order)
      .map((step: WorkflowStep) => {
        if (step.key === 'validated' && this.partner?.status?.[step.key] === 'done' && this.partner.status.sign === 'pending') {
          step.state = 'pending';
          step.class = 'is-secondary';

          return step;
        }
        switch (this.partner?.status?.[step.key]) {
          case 'done':
            step.state = 'done';
            step.class = 'is-primary';
            break;

          case 'pending':
            step.state = 'pending';
            step.class = 'is-secondary';
            break;

          case 'disabled':
            step.state = 'disabled';
            step.class = 'is-danger';
            break;

          default:
            step.state = 'disabled';
            step.class = 'is-secondary';
            break;
        }
        return step;
      });

    this.workflow = workflow;
    this.isLoading = false;
  }
}
