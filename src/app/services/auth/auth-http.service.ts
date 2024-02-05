import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from '@env/environment';
import {LoginModel, PasswordChangeModel, PasswordResetModel, RoleModel, UpdateUserDto, UserModel} from '@models/auth';
import {LoginResponse, ServerResponse} from '@models/http-response';
import {AuthService} from '@services/auth';
import {
  CareersService, CataloguesHttpService,
  CoreService,
  InstitutionsService, LocationsHttpService,
  MessageService,
  SchoolPeriodsService
} from '@services/core';
// import {AuthRoutesEnum, RoutesEnum} from "@shared/enums";
import {RoutesService} from "@services/core/routes.service";
import {RolePipe} from "@shared/pipes";
import {EventModel} from "@models/core";

@Injectable({
  providedIn: 'root'
})

export class AuthHttpService {
  API_URL: string = `${environment.API_URL}/auth`;
  rolePipe: RolePipe = new RolePipe();

  constructor(private readonly httpClient: HttpClient,
              private readonly authService: AuthService,
              private readonly coreService: CoreService,
              private readonly cataloguesHttpService: CataloguesHttpService,
              private readonly locationsHttpService: LocationsHttpService,
              private readonly institutionsService: InstitutionsService,
              private readonly careersService: CareersService,
              private readonly router: Router,
              private readonly routesService: RoutesService,
              private readonly schoolPeriodsService: SchoolPeriodsService,
              private readonly messageService: MessageService) {
  }

  signup(userData: UserModel): Observable<UserModel> {
    const url = `${this.API_URL}/patients/users`;

    // //this.appService.presentLoading();
    return this.httpClient.post<ServerResponse>(url, userData)
      .pipe(
        map(response => {
          this.messageService.success(response);
          return response.data;
        }),
        tap(() => {
          this.router.navigateByUrl('/login')
        })
      );
  }

  changePassword(id: string, credentials: PasswordChangeModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/${id}/change-password`;
    this.coreService.isProcessing = true;
    return this.httpClient.put<ServerResponse>(url, credentials)
      .pipe(
        map(response => {
          this.coreService.isProcessing = false;
          this.messageService.success(response);
          return response.data;
        })
      );
  }

  login(credentials: LoginModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/login`;

    this.findCatalogues();
    this.findLocations();

    return this.httpClient.post<ServerResponse>(url, credentials)
      .pipe(
        map(response => {
          this.authService.token = response.data.accessToken;
          this.authService.auth = response.data.user;
          this.authService.roles = response.data.user.roles;
          this.institutionsService.institutions = response.data.user.institutions;
          this.careersService.careers = response.data.user.careers;
          this.schoolPeriodsService.openSchoolPeriod = response.data.schoolPeriod;
          return response;
        })
      );
  }

  findCatalogues() {
    let catalogues = sessionStorage.getItem('catalogues');

    if (!catalogues || this.coreService.version !== this.coreService.newVersion) {
      this.cataloguesHttpService.findCache().subscribe();
    }
  }

  findLocations() {
    let locations = sessionStorage.getItem('locations');

    if (!locations || this.coreService.version !== this.coreService.newVersion) {
      this.locationsHttpService.findCache().subscribe();
    }
  }

  signOut(): void {
    this.authService.removeLogin();
    this.messageService.successCustom('Cerrar Sesión', 'Se cerró correctamente');
    this.router.navigate(['/login']);
    /*
    const url = `${this.API_URL}/logout`;

    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => {
          this.authService.removeLogin();
          return response.data;
        }),
        tap(() => {
          this.routesService.login();
        })
      );
      */
  }

  loginGoogle(): Observable<LoginResponse> {
    // const url = `${this.URL_PUBLIC}/login/google`;
    const url = `${this.API_URL}/login/google`;
    return this.httpClient.get<LoginResponse>(url);
  }

  resetPassword(credentials: PasswordResetModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/reset-passwords`;
    return this.httpClient.patch<ServerResponse>(url, credentials)
      .pipe(
        map(response => {
          this.messageService.success(response);
          return response;
        }),
        catchError(error => {
          this.authService.removeLogin();
          return throwError(error);
        })
      );
  }

  verifyUser(username: string): Observable<ServerResponse> {
    const url = `${this.API_URL}/verify-user/${username}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  verifyEmail(email: string): Observable<ServerResponse> {
    const url = `${this.API_URL}/verify-email/${email}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  verifyPhone(phone: string): Observable<ServerResponse> {
    const url = `${this.API_URL}/verify-phone/${phone}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  requestTransactionalCode(username: string): Observable<ServerResponse> {
    const url = `${this.API_URL}/transactional-codes/${username}/request`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => {
          this.messageService.success(response);
          return response.data;
        })
      );
  }

  verifyTransactionalCode(token: string, username: string): Observable<ServerResponse> {
    const url = `${this.API_URL}/transactional-codes/${token}/verify`;
    return this.httpClient.patch<ServerResponse>(url, {username})
      .pipe(
        map(response => {
          this.messageService.success(response);
          return response.data;
        })
      );
  }

  getProfile(): Observable<UserModel> {
    const url = `${this.API_URL}/profile`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {

        return response.data;
      })
    );
  }

  getUserInformation(): Observable<UserModel> {
    const url = `${this.API_URL}/user-information`;


    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {

        return response.data;
      })
    );
  }

  updateProfile(payload: UpdateUserDto): Observable<UserModel> {
    const url = `${this.API_URL}/profile`;

    this.coreService.isProcessing = true;
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.isProcessing = false;
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  updateUserInformation(payload: UpdateUserDto): Observable<UserModel> {
    const url = `${this.API_URL}/user-information`;

    this.coreService.isProcessing = true;
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.isProcessing = false;
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  uploadAvatar(id: string, payload: FormData): Observable<UserModel> {
    const url = `${this.API_URL}/${id}/avatar`;

    this.coreService.isProcessing = true;
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.coreService.isProcessing = false;
        this.messageService.success(response);
        return response.data;
      })
    );
  }
}
