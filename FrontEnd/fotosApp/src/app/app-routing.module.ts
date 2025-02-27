import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FotoComponent } from './foto/foto.component';
import { LoginComponent } from './login/login.component';
import { MiBibliotecaComponent } from './mi-biblioteca/mi-biblioteca.component';
import { SubirComponent } from './subir/subir.component';
import { DomComponent } from './dom/dom.component';
import { RegistroComponent } from './login/registro/registro.component';
import { GruposComponent } from './grupos/grupos.component';
import { BusqGruposComponent } from './busq-grupos/busq-grupos.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "foto/:id/:idUs/:tipo", component: FotoComponent},
  {path: "foto/:id/:tipo", component: FotoComponent},
  {path: "login", component: LoginComponent},
  {path: "miBiblioteca/:id", component: MiBibliotecaComponent},
  {path: "subir", component: SubirComponent},
  {path: "registro", component: RegistroComponent},
  {path: "admin", component: DomComponent},
  {path: "busqGrupos", component: BusqGruposComponent},
  {path: "grupos/:id", component: GruposComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
