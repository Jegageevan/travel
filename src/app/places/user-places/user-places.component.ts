import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Place } from '../place.model';


import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
   
    error=signal('');
    isFetching = signal(false);
    private destroyRef = inject(DestroyRef);
     placeService = inject(PlacesService);
    places = this.placeService.loadedUserPlaces;

   ngOnInit(){
        this.isFetching.set(true);
        const subscription = this.placeService.loadUserPlaces().subscribe({
          error:(error) =>{
            this.error.set(error.message);
          },
          complete:() =>{
            this.isFetching.set(false);
          }
        });
        this.destroyRef.onDestroy(()=>{
            subscription.unsubscribe();
        })
    }

    onRemovePlace(place:Place){
        const subscription = this.placeService.removeUserPlace(place).subscribe();
       
        this.destroyRef.onDestroy(()=>{
          subscription.unsubscribe();
      })
    }
}
