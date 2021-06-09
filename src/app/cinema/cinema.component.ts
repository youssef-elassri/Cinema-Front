import { Component, OnInit } from '@angular/core';
import { CinemaService } from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes
  public cinemas
  public salles
  public places
  public selectedTickets
  public currentVille
  public currentCinema
  public currentProjection

  constructor(public cinemaService: CinemaService) { }

  ngOnInit(): void {
    this.selectedTickets = [];
    this.cinemaService.getVilles()
      .subscribe(data => {
        this.villes = data
      }, err => {
        console.log(err)
      })
  }

  onGetCinemas(v) {
    this.salles = undefined
    this.currentVille = v
    this.cinemaService.getCinemas(v)
      .subscribe(data => {
        this.cinemas = data
      }, err => {
        console.log(err)
      })
  }

  onGetSalles(c) {
    this.currentCinema = c
    this.cinemaService.getSalles(c)
      .subscribe(data => {
        this.salles = data
        this.salles._embedded.salles.forEach(salle => {
          this.cinemaService.getProjection(salle)
            .subscribe(data => {
              salle.projections = data
            }, err => {
              console.log(err)
            })
        });
      }, err => {
        console.log(err)
      })
  }

  onGetTicketPlaces(p) {
    this.currentProjection = p
    this.cinemaService.getTicketPlaces(p)
      .subscribe(data => {
        this.currentProjection.tickets = data
        this.selectedTickets = []
      }, err => {
        console.log(err)
      })
  }

  onSelectTicket(t) {
    if (!t.selected) {
      t.selected = true
      this.selectedTickets.push(t)
    }
    else {
      t.selected = false
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1)
    }
  }

  getTicketClass(t) {
    let str = "btn tickets "
    if (t.reserve == true) {
      str += "btn-danger"
    }
    else if (t.selected) {
      str += "btn-warning"
    }
    else {
      str += "btn-success"
    }
    return str
  }

  onPayTickets(dataForm) {
    let tickets = []
    this.selectedTickets.forEach(t => {
      tickets.push(t.id)
    });
    dataForm.tickets = tickets
    this.cinemaService.payTickets(dataForm)
      .subscribe(data => {
        alert('ticket reserved')
        this.onGetTicketPlaces(this.currentProjection)
      }, err => {
        console.log(err)
      })
  }
}
