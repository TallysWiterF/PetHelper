using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using PetHelper.API.Hubs;
using PetHelper.Application;
using PetHelper.Application.Contratos;
using PetHelper.Persistence;
using PetHelper.Persistence.Contexto;
using PetHelper.Persistence.Contratos;

namespace PetHelper.API;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContext<PetHelperContext>(
            context => context.UseSqlite(Configuration.GetConnectionString("PetHelperConnectionString"), b => b.MigrationsAssembly("PetHelper.API"))
        );

        services.AddSignalR();
        services.AddControllers().AddNewtonsoftJson(x => x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);

        services.AddScoped<IPetShopService, PetShopService>();
        services.AddScoped<IClienteService, ClienteService>();
        services.AddScoped<IServicoService, ServicoService>();
        services.AddScoped<IAgendamentoService, AgendamentoService>();

        services.AddScoped<IGeralPersist, GeralPersist>();
        services.AddScoped<IPetShopPersist, PetShopPersist>();
        services.AddScoped<IClientePersist, ClientePersist>();
        services.AddScoped<IServicoPersist, ServicoPersist>();
        services.AddScoped<IAgendamentoPersist, AgendamentoPersist>();

        services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalhost4200",
                builder => builder
                    .WithOrigins("http://localhost:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials());
        });


        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "PetHelper.API", Version = "v1" });
        });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "PetHelper.API v1"));
        }

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthorization();

        app.UseCors("AllowLocalhost4200");

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapHub<AgendamentoHub>("/agendamentoHub");
        });
    }
}
