using LouageApi.DTOs;
using LouageApi.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using static LouageApi.DTOs.Response;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace LouageApi.AuthRepo
{
    public class Authenti (UserManager<AppUser> userManager, IConfiguration config)
    {
        public async Task<GeneralResponse> CreateAccount(RegisterDTO registerDTO)
        {
            if (registerDTO is null) return new GeneralResponse(false, "Model is empty");
            var newUser = new AppUser()
            {
                UserName = registerDTO.Name,
                Email = registerDTO.Email,
                PasswordHash = registerDTO.Password,
                Image = registerDTO.Image,
            };
            var user = await userManager.FindByEmailAsync(newUser.Email);
            if (user is not null) return new GeneralResponse(false, "User registered already");

            var createUser = await userManager.CreateAsync(newUser!, registerDTO.Password);
            if (!createUser.Succeeded)
            {
                StringBuilder errors = new StringBuilder();
                foreach (var error in createUser.Errors)
                {
                    errors.Append(error.Description);
                    errors.Append(" ");
                }
                return new GeneralResponse(false, "Error occured.. please try again " + errors);
            }
            else
            {
                return new GeneralResponse(true, "account created succesfully");
            }
        }

        public async Task<LoginResponse> LoginAccount(LoginDTO loginDTO)
        {
            if (loginDTO == null)
                return new LoginResponse(false, null!, "Login container is empty", null);

            var getUser = await userManager.FindByEmailAsync(loginDTO.Email);
            if (getUser is null)
                return new LoginResponse(false, null!, "User not found", null);

            bool checkUserPasswords = await userManager.CheckPasswordAsync(getUser, loginDTO.Password);
            if (!checkUserPasswords)
                return new LoginResponse(false, null!, "Invalid email/password", null);

            var userSession = new UserSession(getUser.Id, getUser.UserName, getUser.Email);
            string token = GenerateToken(userSession);
            return new LoginResponse(true, token!, "Login completed", userSession);
        }

        private string GenerateToken(UserSession user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var userClaims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id ?? ""),
                new Claim(ClaimTypes.Name, user.Name ?? ""),
                new Claim(ClaimTypes.Email, user.Email ?? "")
            };
            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Audience"],
                claims: userClaims,
                expires: DateTime.Now.AddMinutes(20),
                signingCredentials: credentials
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
