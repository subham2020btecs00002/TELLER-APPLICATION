import java.util.Base64;
import javax.crypto.KeyGenerator;

public class SecretGenerator {
    public static void main(String[] args) throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
        keyGen.init(256); // 256-bit key
        byte[] key = keyGen.generateKey().getEncoded();
        System.out.println(Base64.getEncoder().encodeToString(key));
    }
}
