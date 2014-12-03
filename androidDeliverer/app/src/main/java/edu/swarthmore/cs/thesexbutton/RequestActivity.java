package edu.swarthmore.cs.thesexbutton;

import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.jar.Attributes;

/**
 * Created by wngo1 on 12/1/14.
 */
public class RequestActivity extends Activity {
    SharedPreferences mSharedPreferences;
    String mSessionToken;
    List<NameValuePair> mParams;

    private static final String API = "http://tsb.sccs.swarthmore.edu:8080/api/";
    @Override
    protected  void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fragment);

        FragmentManager fm = getFragmentManager();
        Fragment fragment = fm.findFragmentById(R.id.fragmentContainer);

        if (fragment == null) { //
            // create instance of RequestFragment
            Intent i = getIntent();
            String orderNumber = i.getStringExtra("order_number");
            mSessionToken = i.getStringExtra("session_token");
            fragment = RequestFragment.newInstance(orderNumber, mSessionToken);
            fm.beginTransaction().add(R.id.fragmentContainer, fragment).commit();

            /*
            ServerRequest sr = new ServerRequest();
            JSONObject json = sr.getJSON(API + "delivery/requests/all", mParams);

            if(json!=null){
                try{
                    JSONArray jsonArray = json.getJSONArray("order");
                    List<CondomRequest> condomRequestList = new ArrayList<CondomRequest>();
                    for (int i=0; i<jsonArray.length(); i++) {
                        JSONObject j = jsonArray.getJSONObject(i);
                        CondomRequest cr = new CondomRequest(j);
                        condomRequestList.add(cr);
                    }
                    fragment = RequestFragment.newInstance(condomRequestList.get(0).getOrderNumber());
                    fm.beginTransaction().add(R.id.fragmentContainer, fragment).commit();

                }catch(JSONException e){
                    e.printStackTrace();
                }
            }
            */


        }
    }
}
