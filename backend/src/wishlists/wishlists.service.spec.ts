import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistsService } from './wishlists.service';
import { Wishlist } from './wishlist.entity';
import { Listing } from '../listings/listing.entity';
import { User } from '../users/user.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('WishlistsService', () => {
    let service: WishlistsService;
    let wishlistsRepository: jest.Mocked<Repository<Wishlist>>;
    let listingsRepository: jest.Mocked<Repository<Listing>>;

    const mockUser: Partial<User> = {
        id: 'user-uuid-1',
        email: 'test@example.com',
        name: 'Test User',
    };

    const mockListing: Partial<Listing> = {
        id: 'listing-uuid-1',
        title: '서울 강남 아파트',
        description: '깨끗한 아파트입니다',
        type: 'apartment',
        address: '서울시 강남구',
        images: ['/images/apt1.jpg'],
    };

    const mockWishlist: Partial<Wishlist> = {
        id: 'wishlist-uuid-1',
        name: '제주 여행',
        user: mockUser as User,
        listings: [mockListing as Listing],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const mockWishlistsRepository = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
        };

        const mockListingsRepository = {
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WishlistsService,
                {
                    provide: getRepositoryToken(Wishlist),
                    useValue: mockWishlistsRepository,
                },
                {
                    provide: getRepositoryToken(Listing),
                    useValue: mockListingsRepository,
                },
            ],
        }).compile();

        service = module.get<WishlistsService>(WishlistsService);
        wishlistsRepository = module.get(getRepositoryToken(Wishlist));
        listingsRepository = module.get(getRepositoryToken(Listing));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('새 위시리스트를 생성해야 함', async () => {
            const createDto = { name: '제주 여행' };
            const createdWishlist = { ...mockWishlist, listings: [] };

            wishlistsRepository.create.mockReturnValue(createdWishlist as Wishlist);
            wishlistsRepository.save.mockResolvedValue(createdWishlist as Wishlist);

            const result = await service.create(mockUser as User, createDto);

            expect(wishlistsRepository.create).toHaveBeenCalledWith({
                name: '제주 여행',
                user: mockUser,
                listings: [],
            });
            expect(wishlistsRepository.save).toHaveBeenCalled();
            expect(result.name).toBe('제주 여행');
        });
    });

    describe('findAll', () => {
        it('사용자의 모든 위시리스트를 반환해야 함', async () => {
            const wishlists = [mockWishlist];
            wishlistsRepository.find.mockResolvedValue(wishlists as Wishlist[]);

            const result = await service.findAll(mockUser as User);

            expect(wishlistsRepository.find).toHaveBeenCalledWith({
                where: { user: { id: mockUser.id } },
                relations: ['listings'],
                order: { createdAt: 'DESC' },
            });
            expect(result).toEqual(wishlists);
        });
    });

    describe('findOne', () => {
        it('위시리스트가 존재하면 반환해야 함', async () => {
            wishlistsRepository.findOne.mockResolvedValue(mockWishlist as Wishlist);

            const result = await service.findOne(mockUser as User, 'wishlist-uuid-1');

            expect(result).toEqual(mockWishlist);
        });

        it('위시리스트가 없으면 NotFoundException을 던져야 함', async () => {
            wishlistsRepository.findOne.mockResolvedValue(null);

            await expect(
                service.findOne(mockUser as User, 'non-existent-id'),
            ).rejects.toThrow(NotFoundException);
        });

        it('다른 사용자의 위시리스트면 ForbiddenException을 던져야 함', async () => {
            const otherUserWishlist = {
                ...mockWishlist,
                user: { ...mockUser, id: 'other-user-id' },
            };
            wishlistsRepository.findOne.mockResolvedValue(otherUserWishlist as Wishlist);

            await expect(
                service.findOne(mockUser as User, 'wishlist-uuid-1'),
            ).rejects.toThrow(ForbiddenException);
        });
    });

    describe('update', () => {
        it('위시리스트 이름을 수정해야 함', async () => {
            const updateDto = { name: '부산 여행' };
            const updatedWishlist = { ...mockWishlist, name: '부산 여행' };

            wishlistsRepository.findOne.mockResolvedValue(mockWishlist as Wishlist);
            wishlistsRepository.save.mockResolvedValue(updatedWishlist as Wishlist);

            const result = await service.update(mockUser as User, 'wishlist-uuid-1', updateDto);

            expect(result.name).toBe('부산 여행');
        });
    });

    describe('remove', () => {
        it('위시리스트를 삭제해야 함', async () => {
            wishlistsRepository.findOne.mockResolvedValue(mockWishlist as Wishlist);
            wishlistsRepository.remove.mockResolvedValue(mockWishlist as Wishlist);

            await service.remove(mockUser as User, 'wishlist-uuid-1');

            expect(wishlistsRepository.remove).toHaveBeenCalledWith(mockWishlist);
        });
    });

    describe('addListing', () => {
        it('위시리스트에 숙소를 추가해야 함', async () => {
            const wishlistWithoutListing = { ...mockWishlist, listings: [] };
            const newListing = { ...mockListing, id: 'new-listing-id' };

            wishlistsRepository.findOne.mockResolvedValue(wishlistWithoutListing as Wishlist);
            listingsRepository.findOne.mockResolvedValue(newListing as Listing);
            wishlistsRepository.save.mockResolvedValue({
                ...wishlistWithoutListing,
                listings: [newListing],
            } as Wishlist);

            const result = await service.addListing(
                mockUser as User,
                'wishlist-uuid-1',
                'new-listing-id',
            );

            expect(wishlistsRepository.save).toHaveBeenCalled();
            expect(result.listings).toContain(newListing);
        });

        it('존재하지 않는 숙소면 NotFoundException을 던져야 함', async () => {
            wishlistsRepository.findOne.mockResolvedValue(mockWishlist as Wishlist);
            listingsRepository.findOne.mockResolvedValue(null);

            await expect(
                service.addListing(mockUser as User, 'wishlist-uuid-1', 'non-existent-listing'),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('removeListing', () => {
        it('위시리스트에서 숙소를 제거해야 함', async () => {
            wishlistsRepository.findOne.mockResolvedValue(mockWishlist as Wishlist);
            wishlistsRepository.save.mockResolvedValue({
                ...mockWishlist,
                listings: [],
            } as Wishlist);

            const result = await service.removeListing(
                mockUser as User,
                'wishlist-uuid-1',
                'listing-uuid-1',
            );

            expect(result.listings).toEqual([]);
        });
    });
});
