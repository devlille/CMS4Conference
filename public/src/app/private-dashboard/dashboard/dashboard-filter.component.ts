import { Component, computed, input, output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';

type FilterValueType = 'sign' | 'generated' | 'validated' | 'paid' | 'received' | 'communicated' | 'code';

interface Option {
  value: FilterValueType | string;
  label: string;
}
type Options = Option[];
type OptionWithChecked = Option & { checked: boolean };

export interface Search {
  status: string[];
  packs: string[];
  types: string[];
}

const PackOptions: Options = [
  { value: 'bronze', label: `Bronze` },
  { value: 'silver', label: `Silver` },
  { value: 'gold', label: `Gold` },
  { value: 'party', label: `Party` },
  { value: 'freelance / startup', label: `Freelance / Startup` },
  { value: 'fresque du climat', label: `Fresque du Climat` },
  { value: 'graine de dev', label: `Graine de Dev` }
];
const TypeOptions: Options = [
  { value: 'esn', label: `ESN` },
  { value: 'other', label: `Autres` },
  { value: 'undefined', label: `Non défini` }
];
const StatusOptions: Options = [
  { value: 'validated', label: `Valider` },
  {
    value: 'generated',
    label: `Informations complémentaires`
  },
  { value: 'sign', label: `Signature` },
  { value: 'paid', label: `Paiement` },
  {
    value: 'received',
    label: `Eléments de communication`
  },
  {
    value: 'communicated',
    label: `Communication`
  },
  {
    value: 'code',
    label: `Code`
  }
];

@Component({
  selector: 'cms-dashboard-filter',
  imports: [MatCheckboxModule, MatExpansionModule],
  template: `
    <div>
      <mat-expansion-panel [expanded]="true">
        <mat-expansion-panel-header>
          <mat-panel-title> Par Statut </mat-panel-title>
        </mat-expansion-panel-header>

        @for (option of statusOptionsWithChecked(); track option) {
          <mat-checkbox [checked]="option.checked" (change)="onChange('status', option.value)">{{ option.label }}</mat-checkbox>
        }
      </mat-expansion-panel>

      <mat-expansion-panel [expanded]="true">
        <mat-expansion-panel-header>
          <mat-panel-title> Par Pack </mat-panel-title>
        </mat-expansion-panel-header>
        @for (option of packOptionsWithChecked(); track option) {
          <mat-checkbox [checked]="option.checked" (change)="onChange('packs', option.value)">{{ option.label }}</mat-checkbox>
        }
      </mat-expansion-panel>

      <mat-expansion-panel [expanded]="true">
        <mat-expansion-panel-header>
          <mat-panel-title> Par Type </mat-panel-title>
        </mat-expansion-panel-header>
        @for (option of typeOptionsWithChecked(); track option) {
          <mat-checkbox [checked]="option.checked" (change)="onChange('types', option.value)">{{ option.label }}</mat-checkbox>
        }
      </mat-expansion-panel>
    </div>
  `
})
export class DashboardFilterComponent {
  model = input<Search>();
  modelChange = output<Search>();

  private convertToOptionWithChecked = (options: Options, key: keyof Search) => {
    return options.map((option) => {
      return {
        ...option,
        checked: this.model()?.[key].includes(option.value) ?? false
      };
    });
  };
  statusOptionsWithChecked = computed<OptionWithChecked[]>(() => this.convertToOptionWithChecked(StatusOptions, 'status'));
  packOptionsWithChecked = computed<OptionWithChecked[]>(() => this.convertToOptionWithChecked(PackOptions, 'packs'));
  typeOptionsWithChecked = computed<OptionWithChecked[]>(() => this.convertToOptionWithChecked(TypeOptions, 'types'));

  onChange(onChangeKey: keyof Search, onChangeValue: any) {
    const currentValue = this.model();
    if (!currentValue) {
      return;
    }

    const newValue = Object.entries(currentValue).reduce(
      (acc: Search, [key, values]: [string, string[]]) => {
        const computeValue = () => {
          if (key === onChangeKey) {
            const isPresent = values.find((a) => a === onChangeValue);
            if (!isPresent) {
              return [...values, onChangeValue];
            } else {
              return [...values.filter((e) => e !== onChangeValue)];
            }
          }
          return values;
        };
        return {
          ...acc,
          [key]: computeValue()
        };
      },
      {
        status: [],
        packs: [],
        types: []
      }
    );

    this.modelChange.emit(newValue);
  }
}
