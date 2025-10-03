import { Injectable } from '@nestjs/common';
import { PokeAPIResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

type PokemonInsert = {
  namePokemon: string;
  numberPokemon: number;
};

@Injectable()
export class SeedService {
  // constructor(private readonly pokemonService: PokemonService) {}
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeAPIResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    // const inserPromisesArray = [];
    const pokemonToInsert: PokemonInsert[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const numberPokemon = +segments[segments.length - 2];
      const namePokemon = name;
      // const pokemon = await this.pokemonModel.create({ namePokemon, numberPokemon });
      pokemonToInsert.push({
        namePokemon,
        numberPokemon,
      });
      // console.log('name: ', name);
      // console.log('Id: ', number);
      // this.pokemonService.create({ namePokemon, numberPokemon });
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'seed exectuted';
  }
}
