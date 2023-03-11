import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output,EventEmitter } from '@angular/core';
import { TreeComponent, TreeModel, ITreeOptions, ITreeState } from 'angular-tree-component';


@Component({
  selector: 'tree-wraper',
  templateUrl: './tree-wraper.component.html',
  styleUrls: ['./tree-wraper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TreeWraperComponent implements OnInit {
  @Input()
  nodes:any =[];

  @ViewChild("tree")
  tree:TreeComponent;
  public treeModel: TreeModel;

  @Input()
  options:ITreeOptions  = { useCheckbox: false,
    useTriState: false,
  };

  @Output() activate = new EventEmitter();

  state: ITreeState;

  constructor() { }

  ngOnInit() {
    this.treeModel =this.tree.treeModel;
  }

  onEvent(event){
    const { id } = event.node.data
    if(id === 1)return;

    this.activate.emit(event);
 }
}
