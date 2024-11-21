import {
  Component,
  ComponentFactoryResolver,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  inject,
  input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowStep, Company } from '../../model/company';
import { FilledComponent } from '../filled/filled.component';
import { Auth } from '@angular/fire/auth';
import { DefaultComponent } from '../default/default.component';
import { AdminFilledComponent } from '../admin-filled/admin-filled.component';
import { AdminValidatedComponent } from '../admin-validated/admin-validated.component';
import { AdminPaidComponent } from '../admin-paid/admin-paid.component';
import { AdminCommunicatedComponent } from '../admin-communicated/admin-communicated.component';
import { AdminCodeComponent } from '../admin-code/admin-code.component';
import { CodeComponent } from '../code/code.component';
import { CommunicatedComponent } from '../communicated/communicated.component';
import { SocialComponent } from '../social/social.component';
import { PaidComponent } from '../paid/paid.component';
import { SignedComponent } from '../signed/signed.component';
import { GeneratedComponent } from '../../generated/generated.component';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'cms-panel-item',
    imports: [CommonModule],
    templateUrl: './panel-item.component.html',
    styleUrls: ['./panel-item.component.scss']
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
    code: CodeComponent,
  };

  adminComponent = {
    filled: AdminFilledComponent,
    validated: AdminValidatedComponent,
    generated: GeneratedComponent,
    sign: SignedComponent,
    paid: AdminPaidComponent,
    received: SocialComponent,
    communicated: AdminCommunicatedComponent,
    code: AdminCodeComponent,
  };

  @ViewChild('content', { read: ViewContainerRef, static: false })
  public content: ViewContainerRef | undefined;

  private readonly componentFactoryResolver = inject(ComponentFactoryResolver);
  private readonly auth = inject(Auth);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['company'] && changes['company']) {
      this.createComponent();
    }
  }

  private createComponent() {
    this.auth.onAuthStateChanged((state) => {
      const isAdmin =
        state?.email?.endsWith('@' + environment.emailDomain) ?? false;
      try {
        const components = isAdmin
          ? this.adminComponent
          : this.publicComponents;
        this.content!.clear();

        const step = this.step();
        const componentInstance = step?.key
          ? components[step.key] ?? DefaultComponent
          : DefaultComponent;
        const componentFactory =
          this.componentFactoryResolver.resolveComponentFactory(
            componentInstance,
          );
        const component = this.content!.createComponent(componentFactory);
        (component.instance as any).step = this.step();
        (component.instance as any).company = this.company();
        (component.instance as any).id = this.id();

        component.changeDetectorRef.detectChanges();
      } catch (e) {}
    });
  }

  ngAfterViewInit(): void {
    this.createComponent();
  }
}
