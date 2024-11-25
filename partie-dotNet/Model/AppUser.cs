using Microsoft.AspNetCore.Identity;

namespace LouageApi.Model
{
    public class AppUser : IdentityUser
    {
        public string? Image { get; set; }
    }
}
