using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using TryOnApi.Model;

namespace LouageApi.Model
{
    
    public class AppDbContext(DbContextOptions options) : IdentityDbContext<AppUser>(options)
    {
        public virtual DbSet<Favori> Favoris { get; set; }
    }
     
}
