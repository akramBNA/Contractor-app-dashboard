import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { SwalService } from '../Swal/swal.service';

interface DeleteWithUndoConfig<T> {
  data: T[];
  setData: (data: T[]) => void;
  id: number | string;matchFn: (item: T) => boolean;
  deleteFn: () => Observable<any>;
  loadingMap: { [key: string]: boolean };
  messages?: {
    confirm?: string;
    success?: string;
    error?: string;
    undo?: string;
  };
afterUpdate?: (data: T[]) => void;
}

@Injectable({providedIn: 'root',})

export class DeleteWithUndoService {
  constructor(private swalService: SwalService) {}

  handle<T>(config: DeleteWithUndoConfig<T>) {
    const { data, setData, id, matchFn, deleteFn, loadingMap, messages, afterUpdate, } = config;

    this.swalService.showConfirmation( messages?.confirm || 'Êtes-vous sûr de vouloir supprimer ?', ).then((result) => {
        if (!result.isConfirmed) return;
        const backup = [...data];
        const updated = data.filter((item) => !matchFn(item));
        setData(updated);
        afterUpdate?.(updated);

        this.swalService.showUndo(messages?.undo || 'Élément supprimé', 5000).then((undoClicked: boolean) => {
            if (undoClicked) {
              setData(backup);
              afterUpdate?.(backup);
              return;
            }

            loadingMap[id] = true;

            deleteFn().pipe(finalize(() => {
                  loadingMap[id] = false;
                }),
              ).subscribe({
                next: (res) => {
                  if (!res.success) {
                    setData(backup);
                    afterUpdate?.(backup);
                    this.swalService.showError( messages?.error || 'Erreur lors de la suppression.', );
                  }
                },
                error: () => {
                  setData(backup);
                  afterUpdate?.(backup);

                  this.swalService.showError( messages?.error || 'Erreur serveur.', );
                },
              });
          });
      });
  }
}
