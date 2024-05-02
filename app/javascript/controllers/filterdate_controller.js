// app/javascript/controllers/filterdate_controller.js
import { Controller } from "stimulus";

export default class extends Controller {
  connect() {
    console.log("Connected to filterdate controller");
  }

  handleChange(){
    const form = this.element.closest('form');
    form.submit();
  }

}
