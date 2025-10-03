import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit') || 0;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.namePokemon = createPokemonDto.namePokemon.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error?.code === 11000) {
        throw new BadRequestException(`Pokemon Exist in Db ${error?.keyvalue}`);
      }
      throw new InternalServerErrorException('Cant Creat pokemon');
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ numberPokemon: 1 })
      .select('-__v');
  }

  async findOne(id: string): Promise<Pokemon | null> {
    let pokemon: Pokemon | null = null;
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ numberPokemon: +id });
    }
    //MongoId
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }
    //name

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        namePokemon: id.toLocaleLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        `pokemoon witd id, name or no "${id}"
        not found `,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);
      if (updatePokemonDto.namePokemon)
        updatePokemonDto.namePokemon =
          updatePokemonDto.namePokemon.toLowerCase();

      await pokemon?.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon?.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon?.deleteOne();
    // return { id };
    // const result = this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id: id,
    });
    if (!deletedCount) {
      throw new BadRequestException(`Pokemon with id: ${id} not found.`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error?.code === 11000) {
      throw new BadRequestException(
        `Pokemon with name or number already exists in the database.`,
      );
    }
    console.error(error); // Se registra el error para depuración en el backend.
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs.`,
    );
  }
}
