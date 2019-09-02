using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace MijnApp_Backend.Security
{
    internal class JwtTokenProvider
    {
        internal const string JwtOriginalIdp = "mijnApp_oidp";
        private readonly IConfiguration _config;

        internal JwtTokenProvider(IConfiguration config)
        {
            _config = config;
        }

        internal string GenerateJsonWebToken(DigidUser digidUser, SignInProvider signInProvider)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var utc0 = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            var issueTime = DateTime.Now;

            var iat = (int)issueTime.Subtract(utc0).TotalSeconds;

            //Expiry depends on the identity provider
            int expiryInMinutes = 0;
            switch (signInProvider)
            {
                case SignInProvider.FakeLogin:
                    expiryInMinutes = int.Parse(_config["Jwt:ExpirationInMinutes:Fake"]);
                    break;
                case SignInProvider.DigidCgi:
                    expiryInMinutes = int.Parse(_config["Jwt:ExpirationInMinutes:DigidCgi"]);
                    break;
            }
            var expires = DateTime.Now.AddMinutes(expiryInMinutes);
            var exp = (int)expires.Subtract(utc0).TotalSeconds;

            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, digidUser.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtOriginalIdp, signInProvider.ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, iat.ToString()),
                new Claim(JwtRegisteredClaimNames.Exp, exp.ToString()),
            };
            
            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                claims,
                expires: expires,
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
