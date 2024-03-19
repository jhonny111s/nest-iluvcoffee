import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Flavor } from './entity/flavor.entity';
import { Coffee } from './entity/coffee.entity';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const flavorMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;
  let flavorRepository: MockRepository;

  beforeEach(async () => {
    const configService = { get: jest.fn().mockReturnThis() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(Flavor),
          useValue: flavorMockRepository(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
    flavorRepository = module.get<MockRepository>(getRepositoryToken(Flavor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const coffeeId = '1';
        const expectedCoffee = {};

        coffeeRepository.findOne.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const coffeeId = '1';
        coffeeRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(coffeeId);
          expect(false).toBeTruthy(); // we should never hit this line
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee #${coffeeId} not found`);
        }
      });
    });
  });

  describe('findAll', () => {
    describe('when coffee exists', () => {
      it('should return the coffee object', async () => {
        const pagination = { limit: 1, offset: 1 };

        const expectedCoffee = {};

        coffeeRepository.find.mockReturnValue(expectedCoffee);
        const coffee = await service.findAll(pagination);
        expect(coffee).toEqual(expectedCoffee);
      });
    });
  });

  describe('create', () => {
    describe('when coffee save', () => {
      it('should return the coffee object', async () => {
        const dto = {
          name: 'Test Coffee',
          brand: 'Test Brand',
          flavors: ['flavor1'],
        };

        const flavor = new Flavor();
        flavor.name = 'flavor1';

        const expectedCoffee = new Coffee();
        expectedCoffee.name = dto.name;
        expectedCoffee.brand = dto.brand;
        expectedCoffee.flavors = [flavor];

        flavorRepository.findOne.mockReturnValue(undefined);
        flavorRepository.create.mockReturnValue(flavor);

        coffeeRepository.create.mockReturnValue(expectedCoffee);
        coffeeRepository.save.mockReturnValue(expectedCoffee);

        const coffee = await service.create(dto);
        expect(coffee).toEqual(expectedCoffee);
        expect(flavorRepository.create).toHaveBeenCalledWith(flavor);
        expect(coffeeRepository.create).toHaveBeenCalledWith({
          ...dto,
          flavors: [flavor],
        });
        expect(coffeeRepository.save).toHaveBeenCalledWith(expectedCoffee);
      });
    });
  });
});
