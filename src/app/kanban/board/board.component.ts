import {Component, Input, OnInit} from '@angular/core';
import {BoardService} from "../board.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Board, Task} from "../board.model";
import {MatDialog} from "@angular/material/dialog";
import {TaskDialogComponent} from "../dialogs/task-dialog.component";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent{

  @Input() board: Board;
  constructor(
    private boardService: BoardService,
    public dialog: MatDialog
  ) { }

  taskDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.board.tasks, event.previousIndex, event.currentIndex);
    this.boardService.updateTasks(this.board.id, this.board.tasks)
  }

  openDialog(task?: Task, idx?: number): void {
    const newTask: Task = {label: "purple"};
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task ? { task: {...task}, isNew: false, boardId: this.board.id, idx} :
                   { task: newTask, isNew: true}
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        if (result.isNew) {
          this.boardService.updateTasks(this.board.id,
            [...this.board.tasks, result.task]
          )};
      } else {
        const update = this.board.tasks;
        console.log(result);
        console.log(`Task index: ${idx}`);
        update.splice(result.idx, 1, result.task);
        this.boardService.updateTasks(this.board.id, this.board.tasks);
      }
    })
  }

  handleDelete() {
    this.boardService.deleteBoard(this.board.id);
  }

}
