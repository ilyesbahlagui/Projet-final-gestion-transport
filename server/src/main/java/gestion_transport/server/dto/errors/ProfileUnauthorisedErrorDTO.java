package gestion_transport.server.dto.errors;

import gestion_transport.server.enums.ProfilEmployeEnum;
import gestion_transport.server.exceptions.ProfileUnauthorisedException;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class ProfileUnauthorisedErrorDTO {
	private ProfilEmployeEnum expectedProfile;

	public ProfileUnauthorisedErrorDTO(ProfileUnauthorisedException exception)
	{
		expectedProfile = exception.getExpectedProfile();
	}
}
