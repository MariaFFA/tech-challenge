import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Flex, Box, Text, Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';

const HeaderContainer = styled.header`
  background-color: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  position: sticky;
  top: 0;
  z-index: 1000;
  will-change: transform;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
    text-decoration: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.gray[600]};
  text-decoration: none;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[900]};
    text-decoration: none;
  }
`;

const UserMenu = styled(Box)`
  position: relative;
  display: inline-block;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]};
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <HeaderContainer>
      <Container>
        <Flex 
          alignItems="center" 
          justifyContent="space-between" 
          py={4}
        >
          <Logo to="/">
            TechBlog
          </Logo>
          
          <Flex alignItems="center" gap={4}>
            <NavLink to="/">Posts</NavLink>
            
            {isAuthenticated ? (
              <>
                <NavLink to="/create">Write</NavLink>
                <UserMenu>
                  <UserButton>
                    <Avatar>
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Text fontSize="sm" color="gray.600">
                      {user?.username}
                    </Text>
                  </UserButton>
                </UserMenu>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Button as={Link} to="/register" size="sm">
                  Sign Up
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Container>
    </HeaderContainer>
  );
};