import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { Company, Workflow, WorkflowStep } from '../../model/company';
import { WorkflowService } from '../../services/workflow.service';
import { LoaderComponent } from '../loader/loader.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { switchMap, tap } from 'rxjs';
import { PanelItemComponent } from '../panel-item/panel-item.component';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'cms-workflow',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    MatExpansionModule,
    PanelItemComponent,
  ],
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent {
  public id: string | undefined | null;
  public workflow: Workflow | undefined;
  public partner: Company | undefined;
  public isLoading: boolean = true;
  public isAdmin: boolean = false;

  private readonly route = inject(ActivatedRoute);
  private readonly partnerStore = inject(StoreService);
  private readonly workflowService = inject(WorkflowService);
  private readonly auth = inject(Auth);

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.auth.onAuthStateChanged((state) => {
      this.isAdmin = state?.email?.endsWith('@gdglille.org') ?? false;
    });

    this.workflowService
      .getAll()
      .pipe(
        tap((workflow) => (this.workflow = workflow[0])),
        switchMap(() => {
          return this.partnerStore.partner$;
        }),
      )
      .subscribe((partner) => {
        this.partner = partner as Company;
        this.applyWorkflow(this.workflow as Workflow);
      });
  }

  applyWorkflow(workflow: Workflow) {
    workflow.steps = workflow.steps
      .sort((s1, s2) => s1.order - s2.order)
      .map((step: WorkflowStep) => {
        console.log(this.partner?.status?.[step.key], step.key);

        if (
          step.key === 'validated' &&
          this.partner?.status?.[step.key] === 'done' &&
          this.partner.status.sign === 'pending'
        ) {
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
