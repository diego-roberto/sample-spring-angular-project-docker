import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSlideToggle } from '@angular/material';
import { Option as Option } from '../../../shared/models/option.model';

@Component({
  selector: 'settings-option',
  templateUrl: './settings-option.component.html',
  styleUrls: ['./settings-option.component.scss']
})
export class SettingsOptionComponent implements OnInit {

  option: Option;
  optionsList: Array<Option>;

  @ViewChild(MdSlideToggle) navbarHoverSlideToggle: MdSlideToggle;
  navbarHoverOption: boolean = false;
  
  constructor(){}

  ngOnInit() {
    this.loadOption();    
  }

  setOption() {
    this.optionsList = [];

    this.option = {name: 'navbar_hover', value: this.navbarHoverOption};
    this.optionsList.push(this.option);

      /* novas opções futuras: */
    // this.option = {name: 'option_name', value: value}
    // this.optionsList.push(this.option)
      /* */

    sessionStorage.removeItem('settings_options');
    sessionStorage.setItem('settings_options', JSON.stringify(this.optionsList));
    
    window.location.reload();
  }

  loadOption(){
    this.optionsList = JSON.parse(sessionStorage.getItem('settings_options'));

    if (this.optionsList != null) {
      this.optionsList.forEach( opt => {
        if (opt.name === "navbar_hover") {        /* novas opções futuras: +if */
          this.navbarHoverOption = opt.value;
          this.navbarHoverSlideToggle.checked = this.navbarHoverOption;
        }
      })
    }
  }

  clearOptions() {
    sessionStorage.removeItem('settings_options');
    window.location.reload();
  }

  changeHoverOption(){
    this.navbarHoverOption = !this.navbarHoverOption;
  }
  
}

