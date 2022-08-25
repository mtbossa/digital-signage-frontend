import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TuiDay, TuiTime } from "@taiga-ui/cdk";
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiGroupModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import {
  TuiDataListWrapperModule,
  TuiFieldErrorModule,
  TuiFieldErrorPipeModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputSliderModule,
  TuiSelectModule,
  TuiStepperModule,
} from "@taiga-ui/kit";

class User {
  constructor(readonly firstName: string, readonly lastName: string) {}

  toString(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

class Account {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly amount: number,
    readonly cardSvg: string
  ) {}
}

@Component({
  selector: `app-media-form`,
  templateUrl: `./media-form.component.html`,
  styleUrls: [`./media-form.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiStepperModule,
    TuiFieldErrorPipeModule,
    TuiFieldErrorModule,
    TuiInputSliderModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiErrorModule,
    TuiGroupModule,
    TuiButtonModule,
    TuiInputModule,
    TuiInputDateModule,
  ],
})
export class MediaFormComponent {
  readonly svgIcons = {
    common: `https://ng-web-apis.github.io/dist/assets/images/common.svg`,
    universal: `https://ng-web-apis.github.io/dist/assets/images/universal.svg`,
    intersection: `https://ng-web-apis.github.io/dist/assets/images/intersection-observer.svg`,
    mutation: `https://ng-web-apis.github.io/dist/assets/images/mutation-observer.svg`,
  };

  persons = [new User(`Roman`, `Sedov`), new User(`Alex`, `Inkin`)];

  testForm = new FormGroup({
    nameValue: new FormControl(``, Validators.required),
    textValue: new FormControl(``, Validators.required),
    passwordValue: new FormControl(``, Validators.required),
    phoneValue: new FormControl(``, Validators.required),
    moneyValue: new FormControl(`100`, Validators.required),
    periodValue: new FormControl(new TuiDay(2017, 2, 15), Validators.required),
    timeValue: new FormControl(new TuiTime(12, 30), Validators.required),
    personValue: new FormControl(this.persons[0]),
    quantityValue: new FormControl(0, Validators.required),
    radioValue: new FormControl(`with-commission`),
    accountWherefrom: new FormControl(null),
    accountWhere: new FormControl(null),
    checkboxValue: new FormControl(false),
    osnoValue: new FormControl(false),
    usnValue: new FormControl(false),
    eshnValue: new FormControl(false),
    envdValue: new FormControl(false),
    usn2Value: new FormControl(false),
    patentValue: new FormControl(false),
  });
}
