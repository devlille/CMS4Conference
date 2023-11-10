import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow, WorkflowStep, Company } from '../../model/company';

@Component({
    selector: 'cms-code',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './code.component.html',
    styleUrls: ['./code.component.scss'],
})
export class CodeComponent {
    @Input({ required: true }) workflow!: Workflow;
    @Input({ required: true }) step!: WorkflowStep;
    @Input({ required: true }) company!: Company;

    billetWebUrl: string | undefined;
    billetWebDone: boolean | undefined;

    ngOnInit() {
        this.billetWebUrl = this.company.billetWebUrl;
        this.billetWebDone = this.company.billetWebDone;
    }
}
