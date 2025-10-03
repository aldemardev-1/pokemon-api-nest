<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Ejecutar en desarrollo

1. clonar el repositorio
2. ejcutar
```
  yarn install
```

3. tener Nest CLI instalado
```
  npm i -g @nestjs/cli
```

4. levantar la base de datos
```
  docker compose up -d
```
5. clonar el archivo __.env.template__  y renombrar la copia a __.env__

6. llenar las variables de entorno definidas en el ```.env```

7. Ejecutar la aplicacion en dev: 

```
 npm run start:dev
```

6. reconstruir la base de datos con la semilla 

```
localhost:3000/api/v2/seed
```

## stack usado

* Nest JS
* Mongo DB

