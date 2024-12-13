import { CommonModule } from '@angular/common';
import { Component, ComponentFactoryResolver, SimpleChanges, ViewContainerRef, inject, input, viewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';

import { environment } from '../../../environments/environment';
import { GeneratedComponent } from '../../generated/generated.component';
import { WorkflowStep, Company } from '../../model/company';
import { AdminCodeComponent } from '../admin-code/admin-code.component';
import { AdminCommunicatedComponent } from '../admin-communicated/admin-communicated.component';
import { AdminFilledComponent } from '../admin-filled/admin-filled.component';
import { AdminPaidComponent } from '../admin-paid/admin-paid.component';
import { AdminValidatedComponent } from '../admin-validated/admin-validated.component';
import { CodeComponent } from '../code/code.component';
import { CommunicatedComponent } from '../communicated/communicated.component';
import { DefaultComponent } from '../default/default.component';
import { FilledComponent } from '../filled/filled.component';
import { PaidComponent } from '../paid/paid.component';
import { SignedComponent } from '../signed/signed.component';
import { SocialComponent } from '../social/social.component';

@Component({
  selector: 'cms-panel-item',
  imports: [CommonModule],
  templateUrl: './panel-item.component.html'
})
export class PanelItemComponent {
  readonly step = input<WorkflowStep>();
  readonly company = input<Company>();
  readonly id = input<string>();

  publicComponents = {
    filled: FilledComponent,
    validated: AdminValidatedComponent,
    generated: GeneratedComponent,
    sign: SignedComponent,
    paid: PaidComponent,
    received: SocialComponent,
    communicated: CommunicatedComponent,
    code: CodeComponent
  };

  adminComponent = {
    filled: AdminFilledComponent,
    validated: AdminValidatedComponent,
    generated: GeneratedComponent,
    sign: SignedComponent,
    paid: AdminPaidComponent,
    received: SocialComponent,
    communicated: AdminCommunicatedComponent,
    code: AdminCodeComponent
  };

  readonly content = viewChild('content', { read: ViewContainerRef });

  private readonly componentFactoryResolver = inject(ComponentFactoryResolver);
  private readonly auth = inject(Auth);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['company'] && changes['company']) {
      this.createComponent();
    }
  }

  private createComponent() {
    this.auth.onAuthStateChanged((state) => {
      const isAdmin = state?.email?.endsWith('@' + environment.emailDomain) ?? false;
      try {
        const components = isAdmin ? this.adminComponent : this.publicComponents;
        this.content()!.clear();

        const step = this.step();
        const componentInstance = step?.key ? (components[step.key] ?? DefaultComponent) : DefaultComponent;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentInstance);
        const component = this.content()!.createComponent(componentFactory);
        (component.instance as any).step = this.step();
        (component.instance as any).company = this.company();
        (component.instance as any).id = this.id();

        component.changeDetectorRef.detectChanges();
      } catch (e) {
        console.error(e);
      }
    });
  }

  ngAfterViewInit(): void {
    this.createComponent();
  }
}
