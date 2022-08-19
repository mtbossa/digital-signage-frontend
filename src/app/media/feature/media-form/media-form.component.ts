import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TuiDay, TuiTime } from "@taiga-ui/cdk";

@Component({
  selector: `app-media-form`,
  templateUrl: `./media-form.component.html`,
  styleUrls: [`./media-form.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class MediaFormComponent {
  testForm = new FormGroup({
    nameValue: new FormControl(``, Validators.required),
    textValue: new FormControl(``, Validators.required),
    passwordValue: new FormControl(``, Validators.required),
    phoneValue: new FormControl(``, Validators.required),
    moneyValue: new FormControl(`100`, Validators.required),
    periodValue: new FormControl(new TuiDay(2017, 2, 15), Validators.required),
    timeValue: new FormControl(new TuiTime(12, 30), Validators.required),
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
