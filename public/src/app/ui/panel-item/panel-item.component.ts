import {
  Component,
  ComponentFactoryResolver,
  Input,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowStep, Company } from '../../model/company';
import { FilledComponent } from '../filled/filled.component';
import { Auth } from '@angular/fire/auth';
import { DefaultComponent } from '../default/default.component';
import { AdminFilledComponent } from '../admin-filled/admin-filled.component';
import { ValidatedComponent } from '../validated/validated.component';
import { AdminValidatedComponent } from '../admin-validated/admin-validated.component';
import { AdminSignedComponent } from '../admin-signed/admin-signed.component';
import { AdminPaidComponent } from '../admin-paid/admin-paid.component';
import { AdminSocialComponent } from '../admin-social/admin-social.component';
import { AdminCommunicatedComponent } from '../admin-communicated/admin-communicated.component';
import { AdminCodeComponent } from '../admin-code/admin-code.component';
import { CodeComponent } from '../code/code.component';
import { CommunicatedComponent } from '../communicated/communicated.component';
import { SocialComponent } from '../social/social.component';
import { PaidComponent } from '../paid/paid.component';
import { SignedComponent } from '../signed/signed.component';
import { GeneratedComponent } from '../../generated/generated.component';

@Component({
  selector: 'cms-panel-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-item.component.html',
  styleUrls: ['./panel-item.component.scss'],
})
export class PanelItemComponent {
  @Input() step: WorkflowStep | undefined;
  @Input() company: Company | undefined;
  @Input() id: string | undefined;

  publicComponents = {
    filled: FilledComponent,
    validated: ValidatedComponent,
    generated: GeneratedComponent,
    sign: SignedComponent,
    paid: PaidComponent,
    received: SocialComponent,
    communicated: CommunicatedComponent,
    code: CodeComponent,
  };

  adminComponent = {
    filled: AdminFilledComponent,
    validated: ValidatedComponent, //AdminValidatedComponent,
    generated: GeneratedComponent,
    sign: AdminSignedComponent,
    paid: AdminPaidComponent,
    received: AdminSocialComponent,
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
      const isAdmin = state?.email?.endsWith('@gdglille.org') ?? false;
      try {
        const components = isAdmin
          ? this.adminComponent
          : this.publicComponents;
        this.content!.clear();

        const componentInstance = this.step?.key
          ? components[this.step.key] ?? DefaultComponent
          : DefaultComponent;
        const componentFactory =
          this.componentFactoryResolver.resolveComponentFactory(
            componentInstance
          );
        const component = this.content!.createComponent(componentFactory);
        (component.instance as any).step = this.step;
        (component.instance as any).company = this.company;
        (component.instance as any).id = this.id;

        component.changeDetectorRef.detectChanges();
      } catch (e) {}
    });
  }

  ngAfterViewInit(): void {
    this.createComponent();
  }
}
