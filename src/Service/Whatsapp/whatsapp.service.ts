import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  private apiUrl = 'https://api.whatsapp.com/enviarMensaje'; 
  private token = 'EAALQ6L0NArsBOZCWLZBPgS9NEQHZBAA4q75kCZCdRw3Ru9cMuVbL18MmVNvZCQoMLFTAZAt0We4YEvZCiIAB8PrbkwBNqqbKZBw0AKxjZAYgZA6hZCLeVZCFJxaeuSPcNTmV3yUGTLOcAL4hW2zSURFbUXovZAe18PWZB6PjgileN1JmlxNPt6RmqPQc3Mo7h81zm3TcoQZAEymgYSNhK5fThSwnQ8ZCf9F6aYMZD';

  constructor(private http: HttpClient) { }

  sendMetaBusinessMessage(phoneNumber: string, message: string): Promise<any> {
    const url = `${this.apiUrl}/send-message`; 

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      "phone_number": phoneNumber,
      "message": message
    };

    return this.http.post(url, body, { headers }).toPromise();
  }
}
