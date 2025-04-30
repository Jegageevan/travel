import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);


  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3002/places') 
    }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3002/user-places').pipe( tap({
      next: (userPlaces) => this.userPlaces.set(userPlaces),
    }))
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();
    if(!prevPlaces.some((p) => p.id===place.id)){
       this.userPlaces.set([...prevPlaces,place]);
    }
    return this.httpClient.put('http://localhost:3002/user-places',{
      placeId:place.id
    }).pipe(
      catchError(error => {
        this.userPlaces.set(prevPlaces);
        return throwError(() => new Error('Failed to sotre selected place'))
      })
    )
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces();
    if(prevPlaces.some((p) => p.id===place.id)){
      this.userPlaces.set(prevPlaces.filter((p) => p.id !== place.id));
    }
    return this.httpClient.delete('http://localhost:3002/user-places/'+place.id).pipe(

      catchError(error => {
        this.userPlaces.set(prevPlaces);
        return throwError(() => new Error('Failed to remove'))
      })

    );
  }

 private fetchPlaces(url:string){
    return this.httpClient.get<{places:Place[]}>(url).pipe(
            map((resData)=> resData.places)
          );
  }
}
