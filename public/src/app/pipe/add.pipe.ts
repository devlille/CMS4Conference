import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { addDays } from 'date-fns';

@Pipe({
    name: 'add',
    standalone: true,
})
export class AddPipe implements PipeTransform {
    transform(value: Timestamp | undefined, days: number): Date {
        if (!value) {
            return new Date();
        }
        return addDays(value.toDate(), days);
    }
}
