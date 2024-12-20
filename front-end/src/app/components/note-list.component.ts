import { Component, NgModule } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NoteService } from '../services/note.service';
import { NgFor, SlicePipe, NgIf } from '@angular/common';
import {
  FormControl,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

interface Note {
  _id: string;
  title: string;
  content: string;
}

@Component({
  selector: 'note-list',
  templateUrl: './note-list.html',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgFor, SlicePipe, ReactiveFormsModule, NgIf],
})

export class NoteListComponent {
  notes: Note[] = [];
  noteList: Note[] = [];
  searchValue = new FormControl();

  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.noteService.getNotes().subscribe((data: any) => {
      this.notes = data;
      this.noteList = data;
    });

    this.searchValue.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.notes = this.noteList.filter((note) => {
          return note.title.toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
  }

  deleteNote(id: string) {
    this.noteService.deleteNote(id).subscribe(() => {
      this.notes = this.notes.filter((note) => note._id !== id);
    });
  }

  filterNotes(title: string) {
    if (!title) {
      return this.notes;
    }
    return this.notes.filter((note) =>
      note.title.toLowerCase().includes(title.toLowerCase())
    );
  }
}
