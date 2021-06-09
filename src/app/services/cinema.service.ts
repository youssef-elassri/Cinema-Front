import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  public host:string="http://localhost:8080"

  constructor(private http: HttpClient) { }

  public getVilles(){
    return this.http.get(this.host+'/villes')
  }

  // public getCategories(){
  //   return this.http.get(this.host+'/categories')
  // }

  public getCinemas(v){
    return this.http.get(v._links.cinemas.href)
  }

  public getSalles(c){
    return this.http.get(c._links.salles.href)
  }

  public getProjection(salle){
    let url = salle._links.projections.href.replace("{?projection}","")
    return this.http.get(url+"?projection=p1")
  }

  public getTicketPlaces(p){
    let url = p._links.tickets.href.replace("{?projection}","")
    return this.http.get(url+"?projection=tProj")
  }

  public payTickets(dataForm){
    return this.http.post(this.host+"/payerTickets", dataForm)
  }
}
