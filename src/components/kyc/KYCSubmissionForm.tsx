import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface KYCSubmissionFormProps {
  onSubmissionCreated: (submissionId: string) => void;
}

export function KYCSubmissionForm({ onSubmissionCreated }: KYCSubmissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: 'Nigerian',
    phoneNumber: '',
    bvn: '',
    nin: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: 'Nigeria',
    documentType: 'national_id',
    documentNumber: '',
    expiryDate: '',
    issuingCountry: 'Nigeria'
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-kyc', {
        body: {
          personalInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            nationality: formData.nationality,
            phoneNumber: formData.phoneNumber
          },
          addressInfo: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            stateProvince: formData.stateProvince,
            postalCode: formData.postalCode,
            country: formData.country
          },
          idInfo: {
            documentType: formData.documentType,
            documentNumber: formData.documentNumber,
            expiryDate: formData.expiryDate,
            issuingCountry: formData.issuingCountry
          }
        }
      });

      if (error) throw error;

      toast.success('KYC submission created successfully');
      onSubmissionCreated(data.submission.id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit KYC');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Enter your personal details as they appear on your ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date of Birth</Label>
              <Input type="date" required value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
            </div>
            <div>
              <Label>Nationality</Label>
              <Input required value={formData.nationality} onChange={(e) => setFormData({...formData, nationality: e.target.value})} />
            </div>
          </div>
          <div>
            <Label>Phone Number (Nigerian format)</Label>
            <Input type="tel" required placeholder="+234 800 000 0000" pattern="^\+?234[789][01]\d{8}$" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>BVN (Bank Verification Number)</Label>
              <Input required placeholder="22222222222" pattern="^\d{11}$" maxLength={11} value={formData.bvn} onChange={(e) => setFormData({...formData, bvn: e.target.value})} />
            </div>
            <div>
              <Label>NIN (National Identity Number)</Label>
              <Input required placeholder="12345678901" pattern="^\d{11}$" maxLength={11} value={formData.nin} onChange={(e) => setFormData({...formData, nin: e.target.value})} />
            </div>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Address Line 1</Label>
            <Input required value={formData.addressLine1} onChange={(e) => setFormData({...formData, addressLine1: e.target.value})} />
          </div>
          <div>
            <Label>Address Line 2</Label>
            <Input value={formData.addressLine2} onChange={(e) => setFormData({...formData, addressLine2: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>City</Label>
              <Input required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <Label>State/Province</Label>
              <Input required value={formData.stateProvince} onChange={(e) => setFormData({...formData, stateProvince: e.target.value})} />
            </div>
            <div>
              <Label>Postal Code</Label>
              <Input required value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} />
            </div>
          </div>
          <div>
            <Label>Country</Label>
            <Input required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ID Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Document Type</Label>
            <Select value={formData.documentType} onValueChange={(value) => setFormData({...formData, documentType: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="drivers_license">Driver's License</SelectItem>
                <SelectItem value="national_id">National ID</SelectItem>
                <SelectItem value="residence_permit">Residence Permit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Document Number</Label>
              <Input required value={formData.documentNumber} onChange={(e) => setFormData({...formData, documentNumber: e.target.value})} />
            </div>
            <div>
              <Label>Expiry Date</Label>
              <Input type="date" required value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
            </div>
          </div>
          <div>
            <Label>Issuing Country</Label>
            <Input required value={formData.issuingCountry} onChange={(e) => setFormData({...formData, issuingCountry: e.target.value})} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Continue to Document Upload
      </Button>
    </form>
  );
}
