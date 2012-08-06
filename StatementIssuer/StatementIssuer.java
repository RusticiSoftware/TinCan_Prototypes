/**
 * This single file Java program shows an example of sending simple Tin Can statements,
 * which can optionally include results (score, completion, etc). Typical production quality
 * programs would normally utilize a JSON library instead of building JSON manually, and rely
 * on a client library to do HTTP communication,  but we implement manually here to keep this 
 * file free of external dependencies.
 * 
 * To run the file, just "javac StatementIssuer.java && java StatementIssuer" on the command line
 * 
 *   Copyright 2012 Rustici Software, LLC
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import sun.misc.BASE64Encoder;


public class StatementIssuer {

	public static void main(String[] args) throws Exception {
		
		//Best to get these values from a config file, or command line
		boolean isPublic = true;
		boolean useSandbox = true;
		String appId = isPublic ? "public" : "AppId";
		String secretKey = isPublic ? "test" : "SecretKey";
		String tincanUrl = "https://cloud.scorm.com/ScormEngineInterface/TCAPI/" + appId;
		if(!isPublic && useSandbox){
			tincanUrl += "/sandbox";
		}
		
		StatementIssuer issuer = new StatementIssuer(appId, secretKey, tincanUrl);
		
		SimpleStatementInfo stmt = new StatementIssuer.SimpleStatementInfo();
		
		stmt.userDisplayName = "Test User";
		stmt.userEmail = "test@example.com";
		stmt.verb = "passed"; //Implies completion = true, success = true in results
		stmt.activityId = "com.example/ExampleActivity1";
		stmt.activityName = "The Example Activity";
		stmt.activityDescription = "Just an example activity";
		stmt.scaledScore = 0.80;
		
		List<SimpleStatementInfo> stmts = new ArrayList<SimpleStatementInfo>();
		stmts.add(stmt);

		System.out.println("Sending -> " + stmt.toJson());
		String result = issuer.sendStatements(stmts);
		System.out.println("Result -> " + result);
	}
	
	
	
	public String authUser;
	public String authPassword;
	public String tincanUrl;
	
	public StatementIssuer(String authUser, String authPassword, String tcapiEndpoint){
		this.authUser = authUser;
		this.authPassword = authPassword;
		this.tincanUrl = tcapiEndpoint;
	}
	
	public String sendStatements(List<SimpleStatementInfo> stmts) throws Exception {
		StringBuilder json = new StringBuilder("[");
		boolean first = true;
		for(SimpleStatementInfo stmt : stmts){
			json.append(first ? "" : ",");
			json.append(stmt.toJson());
            first = false;
		}
		json.append("]");
		return makeRequest(tincanUrl + "/statements", authUser, authPassword, json.toString());
	}
	
	
	public static class SimpleStatementInfo {
		String userDisplayName;
		String userEmail;
		
		String userAccountUrl;
		String userAccountName;
		
		String verb = "experienced";
		
		String activityId; //Ex: scorm.com/GolfExample_TCAPI
		String activityName; //Ex: The Golf Example
		String activityDescription; //Ex: An example activity, centered around the game of golf.

		//Can be null (and therefore not included in the results)
		Boolean completion;
		Boolean success;
		Double scaledScore; //Must be between 0 and 1, if included
		
		
		public String toJson(){
			StringBuilder json = new StringBuilder();
			json.append("{");
			
				json.append("\"actor\":{");
					json.append("\"name\":[\"" + userDisplayName + "\"]");
					if(userEmail != null){
						json.append(",\"mbox\":[\"mailto:" + userEmail + "\"]");
					}
					if(userAccountUrl != null && userAccountName != null){
						json.append(",\"account\":{");
						json.append("\"accountServiceHomePage\":\"" + userAccountUrl + "\",");
						json.append("\"accountName\":\"" + userAccountName + "\"");
						json.append("}");
					}
				json.append("},");
				
				json.append("\"verb\":\"" + verb + "\",");
				
				json.append("\"object\":{");
					json.append("\"objectType\":\"Activity\",");
					json.append("\"id\":\"" + activityId + "\",");
					json.append("\"definition\":{");
						json.append("\"name\":{\"en-US\":\"" + activityName + "\"},");
						json.append("\"description\":{\"en-US\":\"" + activityDescription + "\"}");
					json.append("}");
				json.append("}");
				
				if(completion != null || success != null || scaledScore != null){
					boolean first = true;
					json.append(",\"result\":{");
						if(completion != null){
							json.append("\"completion\":\"" + completion.toString() + "\"");
							first = false;
						}
						if(success != null){
							json.append(first ? "" : ",");
							json.append("\"success\":\"" + success.toString() + "\"");
							first = false;
						}
						if(scaledScore != null){
							DecimalFormat df = new DecimalFormat("0.00");
							json.append(first ? "" : ",");
							json.append("\"score\": {\"scaled\":" + df.format(scaledScore) + "}");
							first = false;
						}
					json.append("}");
				}
			
			json.append("}");
			
			return json.toString();
		}
	}

	
    public static String makeRequest(String urlStr, String userName, String password, String postData) throws Exception
    {
        URL url = new URL(urlStr);
        
        ByteArrayOutputStream responseBytes = new ByteArrayOutputStream();
    	InputStream responseStream = null;
    	URLConnection connection = null;
    	
    	try {
        	
	        connection = url.openConnection();
	        connection.setConnectTimeout(5000);
	        connection.setReadTimeout(30000);
	        connection.setDoOutput(true);
	        connection.setDoInput(true);
	        connection.setUseCaches(false);
	        
	        BASE64Encoder encoder = new BASE64Encoder();
	        String basicAuthHeader = "Basic " + encoder.encode((userName+":"+password).getBytes("UTF-8"));
	        ((HttpURLConnection)connection).setRequestProperty("Authorization", basicAuthHeader);

        	if (postData != null) {
				((HttpURLConnection) connection).setRequestMethod("POST");
				connection.setRequestProperty("Content-Type", "application/json");
				connection.setRequestProperty("Content-Length", "" + Integer.toString(postData.getBytes().length));
				DataOutputStream wr = new DataOutputStream (connection.getOutputStream ());
				try {
					wr.writeBytes (postData);
					wr.flush ();
					}
				finally {
					wr.close ();
				}
        	}
    		responseStream = connection.getInputStream();
	        
	        bufferedCopyStream(responseStream, responseBytes);
	        responseBytes.flush();
	        responseBytes.close();
	        return new String(responseBytes.toByteArray(), "UTF-8");
        } 
    	catch (IOException ioe) {
    		return ioe.getMessage() + " -> " + readStreamAsString(((HttpURLConnection)connection).getErrorStream());
    	}
        finally {
        	if(responseStream != null){
        		responseStream.close();
        	}
        }
    }
    
    public static String readStreamAsString(InputStream is) throws Exception {
    	ByteArrayOutputStream baos = new ByteArrayOutputStream();
    	bufferedCopyStream(is, baos);
    	return new String(baos.toByteArray(), "UTF-8");
    }
    
    public static boolean bufferedCopyStream(InputStream inStream, OutputStream outStream) throws Exception {
        BufferedInputStream bis = new BufferedInputStream( inStream );
        BufferedOutputStream bos = new BufferedOutputStream ( outStream );
        while(true){
            int data = bis.read();
            if (data == -1){
                break;
            }
            bos.write(data);
        }
        bos.flush();
        return true;
    }
}

