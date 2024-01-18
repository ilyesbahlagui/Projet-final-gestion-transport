package gestion_transport.server.exceptions;

import gestion_transport.server.enums.ProfilEmployeEnum;
import lombok.Getter;

@Getter
public class ProfileUnauthorisedException extends RuntimeException {
	private ProfilEmployeEnum expectedProfile;

	public static ProfileUnauthorisedException ADMIN_ONLY = new ProfileUnauthorisedException(ProfilEmployeEnum.ADMINISTRATEUR);

	public ProfileUnauthorisedException(ProfilEmployeEnum expectedProfile)
	{
		super("Expected profile: " + expectedProfile.name());
		this.expectedProfile = expectedProfile;
	}
}
