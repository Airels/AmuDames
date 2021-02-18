import { HttpClient, HttpHeaders } from '@angular/common/http';

export class HttpService {
    private serverURL = "http://localhost:8080";

    constructor(private http: HttpClient) {

    }
}