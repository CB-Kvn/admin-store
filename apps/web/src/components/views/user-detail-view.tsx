import { ArrowLeft, Edit, Lock, Unlock, RefreshCw, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { StatusBadge } from '../status-badge';
import {
  mockUsers,
  mockOAuthAccounts,
  mockAddresses,
  mockDiscountUsers,
  mockDiscounts,
} from '../../lib/mock-data';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

interface UserDetailViewProps {
  userId: string;
  onBack: () => void;
  onEdit?: (id: string) => void;
}

export function UserDetailView({ userId, onBack, onEdit }: UserDetailViewProps) {
  const user = mockUsers.find(u => u.id === userId);
  const oauthAccounts = mockOAuthAccounts.filter(o => o.userId === userId);
  const addresses = mockAddresses.filter(a => a.userId === userId);
  const assignedDiscounts = mockDiscountUsers
    .filter(du => du.userId === userId)
    .map(du => mockDiscounts.find(d => d.id === du.discountId))
    .filter(Boolean);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="mb-2">User not found</h2>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const getRoleVariant = (role: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      admin: 'error',
      manager: 'warning',
      staff: 'default',
      customer: 'success',
    };
    return variants[role] || 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1>
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit?.(userId)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {user.active ? (
            <Button variant="outline">
              <Lock className="mr-2 h-4 w-4" />
              Deactivate
            </Button>
          ) : (
            <Button variant="outline">
              <Unlock className="mr-2 h-4 w-4" />
              Activate
            </Button>
          )}
          {user.loginAttempts > 0 && (
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Login Attempts
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div>{user.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Role</div>
                <div>
                  <StatusBadge
                    status={user.role}
                    variant={getRoleVariant(user.role)}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div>
                  <StatusBadge
                    status={user.active ? 'active' : 'inactive'}
                    variant={user.active ? 'success' : 'default'}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Login Attempts</div>
                <div className={user.loginAttempts >= 3 ? 'text-destructive' : ''}>
                  {user.loginAttempts}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Login</div>
                <div>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString('es-ES')
                    : 'Never'}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Locked Until</div>
                <div>
                  {user.lockedUntil
                    ? new Date(user.lockedUntil).toLocaleString('es-ES')
                    : '—'}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Created At</div>
                <div>{new Date(user.createdAt).toLocaleDateString('es-ES')}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Updated At</div>
                <div>{new Date(user.updatedAt).toLocaleDateString('es-ES')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>OAuth Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            {oauthAccounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No OAuth accounts connected
              </p>
            ) : (
              <div className="space-y-3">
                {oauthAccounts.map(account => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{account.provider}</Badge>
                        <span className="text-sm">{account.providerAccountId}</span>
                      </div>
                      {account.expiresAt && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Expires:{' '}
                          {new Date(account.expiresAt).toLocaleDateString('es-ES')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No addresses registered</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map(address => (
                <div key={address.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={address.type === 'billing' ? 'default' : 'outline'}>
                      {address.type}
                    </Badge>
                    {address.isDefault && (
                      <Badge variant="success">Default</Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>{address.street}</div>
                    <div>
                      {address.city}, {address.state}
                    </div>
                    <div>
                      {address.country} {address.postalCode}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Discounts</CardTitle>
        </CardHeader>
        <CardContent>
          {assignedDiscounts.length > 0 ? (
            <div className="space-y-3">
              {assignedDiscounts.map(discount => (
                <div
                  key={discount!.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {discount!.code || 'Auto-applied'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {discount!.type === 'percentage'
                          ? `${discount!.value}% off`
                          : `$${discount!.value} off`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge
                      status={discount!.isActive ? 'active' : 'inactive'}
                      variant={discount!.isActive ? 'success' : 'default'}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Until {new Date(discount!.endDate).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No discounts assigned to this user
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Activity tracking coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
