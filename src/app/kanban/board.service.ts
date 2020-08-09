import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import {switchMap, map} from "rxjs/operators";
import {Board, Task} from "./board.model";
import {firestore} from "firebase";

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore
  ) { }

   /**
    * Creates a new board for the current user
    */
  async createBoard(data: Board) {
    const user = await this.afAuth.currentUser;
    return this.db.collection('boards').add({
      ...data,
      uid: user.uid,
      tasks: [{description: "Enter your task here", label: 'yellow' }]
    })
  }

  /**
   * Delete board
   **/
  deleteBoard(boardId: string) {
    return this.db.collection('boards')
      .doc(boardId)
      .delete();
  }

  /**
   * Updates board by updating every task on that board
   */
  updateBoard(boardId: string, tasks: Task[]) {
    return this.db.collection('boards')
      .doc(boardId)
      .update({tasks})
  }

  /**
   * Updates the tasks on board
   */
  updateTasks(boardId: string, tasks: Task[]) {
    return this.db
      .collection('boards')
      .doc(boardId)
      .update({ tasks });
  }

  /**
   * Removes a specific task from the board
   */
  removeTask(boardId: string, task: Task) {
    return this.db.collection('board')
      .doc(boardId)
      .update({
        tasks : firebase.firestore.FieldValue.arrayRemove(task),
      })
  }

  /**
   * Get all boards owned by current user
   */
  getUserBoards() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          console.log(user.uid);
          return this.db
            .collection<Board>('boards', ref =>
              ref.where('uid', '==', user.uid).orderBy('priority')
            )
            .valueChanges({ idField: 'id'})
        } else {
          return [];
        }
      }),

    );
  }

  /**
   * Batch write to change update priority of each board after sorting
   */
  sortBoards(boards: Board[]) {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = boards.map(b => db.collection('boards').doc(b.id));
    refs.forEach((ref, idx) => batch.update(ref, {priority: idx}));
    batch.commit();
  }

}
