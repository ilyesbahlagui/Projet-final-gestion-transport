package gestion_transport.server.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.mailjet.client.ClientOptions;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.resource.Emailv31;
import org.json.JSONArray;
import org.json.JSONObject;

@Service
public class MailService {
    
    @Value("${mailjet.apiKey}")
    private String apiKey;

    @Value("${mailjet.apiSecret}")
    private String apiSecret;

    public void sendMail(String subject, String text, String... to) {
        try {
            MailjetClient client = new MailjetClient(apiKey, apiSecret, new ClientOptions("v3.1"));

            MailjetRequest request = new MailjetRequest(Emailv31.resource)
                .property(Emailv31.MESSAGES, new JSONArray()
                    .put(new JSONObject()
                        .put(Emailv31.Message.FROM, new JSONObject()
                            .put("Email", "gestiontransport13@gmail.com")
                            .put("Name", "Gestion Transport"))
                        .put(Emailv31.Message.TO, new JSONArray()
                            .put(new JSONObject()
                                .put("Email", to)))
                        .put(Emailv31.Message.SUBJECT, subject)
                        .put(Emailv31.Message.TEXTPART, text)));

            client.post(request);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
