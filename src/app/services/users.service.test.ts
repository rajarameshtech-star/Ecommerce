
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { loginDto, registerDto } from '../../models/user.models';
import { TestBed } from '@angular/core/testing';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create a spy object for Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Configure the TestBed
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsersService,
        { provide: Router, useValue: mockRouter }, // Provide the mocked Router
      ],
    });

    // Inject the service and HttpTestingController
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure no outstanding HTTP requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const mockRegisterData: registerDto = { email: 'test', password: 'password', roles: ['User'] };
    const mockResponse = { message: 'User registered successfully' };

    service.registerUser(mockRegisterData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.apiBaseUrl + 'Auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterData);
    req.flush(mockResponse);
  });

  it('should log in a user', () => {
    const mockLoginData: loginDto = { email: 'test', password: 'password' };
    const mockResponse = {
      success: true,
      expiresAt: '2023-12-31T23:59:59Z',
      token: 'mockToken',
      roles: ['user'],
      userId: '123',
      email: 'test@example.com'
    };

    service.loginUser(mockLoginData).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.userRole()).toBe('user');
    });

    const req = httpMock.expectOne(environment.apiBaseUrl + 'Auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginData);
    req.flush(mockResponse);
  });

  it('should log out a user', () => {
    spyOn(localStorage, 'clear').and.callThrough();
    spyOn(sessionStorage, 'clear').and.callThrough();

    service.logoutUser();

    expect(localStorage.clear).toHaveBeenCalled();
    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(service.isAuthenticated()).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check token expiry and log out if expired', () => {
    spyOn(service, 'logoutUser').and.callThrough();
    const expiredDate = new Date(Date.now() - 1000).toISOString();

    service.checkTokenExpiry(expiredDate);

    expect(service.logoutUser).toHaveBeenCalled();
  });

  it('should set a timeout for token expiry', (done) => {
    spyOn(service, 'logoutUser').and.callThrough();
    const futureDate = new Date(Date.now() + 1000).toISOString();

    service.checkTokenExpiry(futureDate);

    setTimeout(() => {
      expect(service.logoutUser).toHaveBeenCalled();
      done();
    }, 1100);
  });
});