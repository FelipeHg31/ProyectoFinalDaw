import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DomComponent } from './dom/dom.component';
import { EditarComponent } from './editar/editar.component';
import { LoginComponent } from './login/login.component';
import { FotoComponent } from './foto/foto.component';
import { MiBibliotecaComponent } from './mi-biblioteca/mi-biblioteca.component';
import { SubirComponent } from './subir/subir.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegistroComponent } from './login/registro/registro.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { GruposComponent } from './grupos/grupos.component';
import { BusqGruposComponent } from './busq-grupos/busq-grupos.component';
import { NuevoGrupoComponent } from './nuevo-grupo/nuevo-grupo.component';
import { AgregarGruposComponent } from './agregar-grupos/agregar-grupos.component';
import { DescpComentariosComponent } from './descp-comentarios/descp-comentarios.component';
import { provideHttpClient, withFetch } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DomComponent,
    EditarComponent,
    LoginComponent,
    FotoComponent,
    MiBibliotecaComponent,
    SubirComponent,
    RegistroComponent,
    GruposComponent,
    BusqGruposComponent,
    NuevoGrupoComponent,
    AgregarGruposComponent,
    DescpComentariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()) // Habilita fetch API
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
